import api from './axios';

export const searchHotels = (params) => {
  const q = new URLSearchParams();
  if (params.city) q.set('city', params.city);
  if (params.minPrice != null) q.set('minPrice', params.minPrice);
  if (params.maxPrice != null) q.set('maxPrice', params.maxPrice);
  if (params.minRating != null) q.set('minRating', params.minRating);
  if (params.starCategory != null) q.set('starCategory', params.starCategory);
  if (params.stars) q.set('stars', Array.isArray(params.stars) ? params.stars.join(',') : params.stars);
  if (params.amenities) q.set('amenities', Array.isArray(params.amenities) ? params.amenities.join(',') : params.amenities);
  if (params.propertyTypes) q.set('propertyType', Array.isArray(params.propertyTypes) ? params.propertyTypes.join(',') : params.propertyTypes);
  if (params.chainNames) q.set('chainName', Array.isArray(params.chainNames) ? params.chainNames.join(',') : params.chainNames);
  if (params.freeCancellation === true) q.set('freeCancellation', 'true');
  if (params.checkIn) q.set('checkIn', params.checkIn);
  if (params.checkOut) q.set('checkOut', params.checkOut);
  if (params.sort) q.set('sort', params.sort);
  if (params.order) q.set('order', params.order);
  q.set('page', params.page || 1);
  q.set('limit', params.limit || 20);
  return api.get(`/hotels/search?${q.toString()}`);
};

export const getHotelById = (id) => api.get(`/hotels/${id}`);
export const getFeaturedHotels = (limit = 8) => api.get(`/hotels/featured`, { params: { limit } });
export const getPopularDestinations = () => api.get(`/hotels/destinations`);
export const getRoomAvailability = (hotelId, checkIn, checkOut) =>
  api.get(`/hotels/${hotelId}/rooms/availability`, { params: { checkIn, checkOut } });

/* ── Guest Reviews ── */
export const getHotelReviews = (hotelId, page = 1, limit = 10) =>
  api.get(`/reviews/hotel/${hotelId}`, { params: { page, limit } });

export const addHotelReview = (hotelId, data) =>
  api.post(`/reviews/hotel/${hotelId}`, data);

