import { Destination, JourneySlide, HeroConfig } from '../types';

export const DEFAULT_CLOUD_API_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019f876840b70ed1';

export interface CloudPayload {
  destinations: Destination[];
  slides: JourneySlide[];
  heroConfig: HeroConfig;
  updatedAt?: string;
}

function isValidDestination(d: any): boolean {
  return (
    d &&
    typeof d.id === 'string' &&
    typeof d.name === 'string' &&
    typeof d.hero_image === 'string' &&
    d.satisfaction_scores &&
    typeof d.satisfaction_scores.stay === 'number' &&
    Array.isArray(d.activities)
  );
}

/**
 * Tải toàn bộ dữ liệu di sản & danh thắng mới nhất từ Cloud DB 24/7.
 */
export async function fetchCloudData(apiUrl: string = DEFAULT_CLOUD_API_URL): Promise<CloudPayload | null> {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.warn(`Cloud storage returned status ${response.status}`);
      return null;
    }

    const json = await response.json();
    let payload: any = null;
    
    if (json && json.data && Array.isArray(json.data.destinations)) {
      payload = json.data;
    } else if (json && Array.isArray(json.destinations)) {
      payload = json;
    }

    if (payload && Array.isArray(payload.destinations) && payload.destinations.length > 0) {
      if (isValidDestination(payload.destinations[0])) {
        return payload as CloudPayload;
      } else {
        console.warn('Cloud DB chứa dữ liệu không hợp lệ. Sử dụng dữ liệu bộ nhớ đệm an toàn.');
        return null;
      }
    }

    return null;
  } catch (err) {
    console.warn('Không thể kết nối Cloud DB, sử dụng dữ liệu bộ nhớ đệm local:', err);
    return null;
  }
}

/**
 * Đẩy toàn bộ dữ liệu mới chỉnh sửa lên Cloud DB để đồng bộ toàn bộ người dùng 24/7.
 */
export async function saveCloudData(
  payload: CloudPayload,
  apiUrl: string = DEFAULT_CLOUD_API_URL
): Promise<boolean> {
  try {
    const bodyPayload = {
      name: 'TripBudget Vietnam Master Data',
      data: {
        destinations: payload.destinations,
        slides: payload.slides,
        heroConfig: payload.heroConfig,
        updatedAt: new Date().toISOString()
      }
    };

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    return response.ok;
  } catch (err) {
    console.error('Lỗi khi đẩy dữ liệu lên Cloud DB:', err);
    return false;
  }
}
