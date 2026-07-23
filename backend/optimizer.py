import json
import os
import pulp

def load_dataset():
    dataset_path = os.path.join(os.path.dirname(__file__), "dataset.json")
    with open(dataset_path, "r", encoding="utf-8") as f:
        return json.load(f)

def optimize_trip_budget(total_budget: float, num_days: int, destination_id: str, preferences: dict):
    """
    PuLP Linear Programming Budget Optimization Engine
    """
    data = load_dataset()
    dest = next((d for d in data["destinations"] if d["id"] == destination_id), data["destinations"][0])
    
    # Extract user weight preferences (default 1.0 each)
    w_stay = float(preferences.get("stay", 1.0))
    w_food = float(preferences.get("food", 1.0))
    w_trans = float(preferences.get("transport", 1.0))
    w_act = float(preferences.get("activities", 1.0))
    
    # Normalize weights
    total_w = w_stay + w_food + w_trans + w_act
    w_stay /= total_w
    w_food /= total_w
    w_trans /= total_w
    w_act /= total_w
    
    # Get destination satisfaction ratings
    scores = dest["satisfaction_scores"]
    s_stay = float(scores.get("stay", 9.0))
    s_food = float(scores.get("food", 9.0))
    s_trans = float(scores.get("transport", 8.5))
    s_act = float(scores.get("activities", 9.5))
    
    # Create PuLP Maximization Problem
    prob = pulp.LpProblem("TripBudgetOptimization", pulp.LpMaximize)
    
    # Variables: Budget allocation amount for each category (in VND)
    x_stay = pulp.LpVariable("x_stay", lowBound=0, cat="Continuous")
    x_food = pulp.LpVariable("x_food", lowBound=0, cat="Continuous")
    x_trans = pulp.LpVariable("x_trans", lowBound=0, cat="Continuous")
    x_act = pulp.LpVariable("x_act", lowBound=0, cat="Continuous")
    
    # Objective function: Maximize overall Satisfaction Score
    # Score per VND allocated is scaled by category rating * weight preference
    prob += (
        (w_stay * s_stay) * x_stay +
        (w_food * s_food) * x_food +
        (w_trans * s_trans) * x_trans +
        (w_act * s_act) * x_act
    ), "Total_Satisfaction_Score"
    
    # Constraints
    # 1. Total budget constraint
    prob += (x_stay + x_food + x_trans + x_act <= total_budget), "Budget_Cap"
    
    # 2. Lower and upper bound constraints around preference target ratios
    # Stay: between max(15%, w_stay - 15%) and min(60%, w_stay + 20%) of budget
    min_stay_pct = max(0.15, w_stay - 0.15)
    max_stay_pct = min(0.60, w_stay + 0.20)
    prob += (x_stay >= min_stay_pct * total_budget), "Stay_Min"
    prob += (x_stay <= max_stay_pct * total_budget), "Stay_Max"
    
    # Food: between max(15%, w_food - 0.15) and min(50%, w_food + 0.20)
    min_food_pct = max(0.15, w_food - 0.15)
    max_food_pct = min(0.50, w_food + 0.20)
    prob += (x_food >= min_food_pct * total_budget), "Food_Min"
    prob += (x_food <= max_food_pct * total_budget), "Food_Max"
    
    # Transport: between 10% and 35%
    min_trans_pct = max(0.10, w_trans - 0.15)
    max_trans_pct = min(0.35, w_trans + 0.15)
    prob += (x_trans >= min_trans_pct * total_budget), "Trans_Min"
    prob += (x_trans <= max_trans_pct * total_budget), "Trans_Max"
    
    # Activities: remaining
    min_act_pct = max(0.10, w_act - 0.15)
    prob += (x_act >= min_act_pct * total_budget), "Act_Min"
    
    # Solve LP
    prob.solve(pulp.PULP_CBC_CMD(msg=0))
    
    # Extract solved allocations
    alloc_stay = max(0.0, float(pulp.value(x_stay) or 0))
    alloc_food = max(0.0, float(pulp.value(x_food) or 0))
    alloc_trans = max(0.0, float(pulp.value(x_trans) or 0))
    alloc_act = max(0.0, float(pulp.value(x_act) or 0))
    
    total_allocated = alloc_stay + alloc_food + alloc_trans + alloc_act
    
    # Daily averages
    daily_stay = alloc_stay / max(1, num_days)
    daily_food = alloc_food / max(1, num_days)
    daily_trans = alloc_trans / max(1, num_days)
    daily_act = alloc_act / max(1, num_days)
    daily_total = total_allocated / max(1, num_days)
    
    # Percentages
    pct_stay = round((alloc_stay / max(1, total_allocated)) * 100, 1)
    pct_food = round((alloc_food / max(1, total_allocated)) * 100, 1)
    pct_trans = round((alloc_trans / max(1, total_allocated)) * 100, 1)
    pct_act = round((alloc_act / max(1, total_allocated)) * 100, 1)
    
    # Satisfaction Index (0-100 scale)
    overall_satisfaction = round(
        (w_stay * s_stay + w_food * s_food + w_trans * s_trans + w_act * s_act) * 10, 1
    )
    
    # Tier classification
    daily_budget = total_budget / max(1, num_days)
    if daily_budget < 800000:
        tier = "Budget (Tiết Kiệm)"
    elif daily_budget < 2500000:
        tier = "Mid-range (Tiêu Chuẩn)"
    else:
        tier = "Luxury (Cao Cấp)"
        
    # Generate Day-by-Day itinerary timeline
    daily_itinerary = []
    activities_list = dest.get("activities", [])
    
    for day in range(1, num_days + 1):
        day_acts = []
        if activities_list:
            act_idx = (day - 1) % len(activities_list)
            day_acts.append(activities_list[act_idx])
            # Add food item if available
            food_acts = [a for a in activities_list if a.get("category") == "food"]
            if food_acts:
                day_acts.append(food_acts[(day - 1) % len(food_acts)])
                
        daily_itinerary.append({
            "day": day,
            "title": f"Ngày {day}: Khám phá {dest['name'].split('-')[0].strip()}",
            "stay_cost": round(daily_stay),
            "food_cost": round(daily_food),
            "transport_cost": round(daily_trans),
            "activities_cost": round(daily_act),
            "daily_total": round(daily_total),
            "suggested_items": day_acts
        })
        
    return {
        "status": "success",
        "solver": "PuLP Linear Programming COIN-OR",
        "destination": {
          "id": dest["id"],
          "name": dest["name"],
          "region": dest["region"],
          "coordinates": dest["coordinates"],
          "hero_image": dest["hero_image"],
          "gallery_images": dest["gallery_images"]
        },
        "params": {
          "total_budget": total_budget,
          "num_days": num_days,
          "daily_budget": round(daily_budget),
          "tier": tier
        },
        "summary": {
          "total_allocated": round(total_allocated),
          "satisfaction_index": overall_satisfaction,
          "allocations": {
            "stay": { "amount": round(alloc_stay), "percentage": pct_stay, "daily": round(daily_stay) },
            "food": { "amount": round(alloc_food), "percentage": pct_food, "daily": round(daily_food) },
            "transport": { "amount": round(alloc_trans), "percentage": pct_trans, "daily": round(daily_trans) },
            "activities": { "amount": round(alloc_act), "percentage": pct_act, "daily": round(daily_act) }
          }
        },
        "daily_itinerary": daily_itinerary
    }
