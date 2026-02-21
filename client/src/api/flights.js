import api from './axios';

export const searchFlights = (params) => {
  const q = new URLSearchParams();
  if (params.from) q.set('from', params.from);
  if (params.to) q.set('to', params.to);
  if (params.departureDate) q.set('departureDate', params.departureDate);
  if (params.returnDate) q.set('returnDate', params.returnDate);
  if (params.segments) q.set('segments', JSON.stringify(params.segments));
  const passengers = (params.adults || 0) + (params.children || 0) + (params.infants || 0);
  q.set('passengers', passengers < 1 ? 1 : passengers);
  if (params.class) q.set('class', params.class);
  if (params.sort) q.set('sort', params.sort);
  if (params.order) q.set('order', params.order);
  if (params.airline) q.set('airline', params.airline);
  if (params.minPrice != null) q.set('minPrice', params.minPrice);
  if (params.maxPrice != null) q.set('maxPrice', params.maxPrice);
  if (params.maxStops != null) q.set('maxStops', params.maxStops);
  if (params.refundable === true) q.set('refundable', 'true');
  if (params.departureTimeFrom) q.set('departureTimeFrom', params.departureTimeFrom);
  if (params.departureTimeTo) q.set('departureTimeTo', params.departureTimeTo);
  if (params.arrivalTimeFrom) q.set('arrivalTimeFrom', params.arrivalTimeFrom);
  if (params.arrivalTimeTo) q.set('arrivalTimeTo', params.arrivalTimeTo);
  q.set('page', params.page || 1);
  q.set('limit', params.limit || 50);
  return api.get(`/flights/search?${q.toString()}`);
};

export const getFlightById = (id) => api.get(`/flights/${id}`);
export const getAvailableSeats = (id) => api.get(`/flights/${id}/seats`);
export const calculatePrice = (id, body) => api.post(`/flights/${id}/calculate-price`, body);
