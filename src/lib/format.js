export const money = value => `₹${Math.round(value || 0).toLocaleString('en-IN')}`
export const discount = (price, mrp) => mrp > price ? `${Math.round((1 - price / mrp) * 100)}% OFF` : ''
