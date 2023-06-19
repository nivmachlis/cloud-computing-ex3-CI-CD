export const config = () => ({
  NINJA_API_KEY: process.env.NINJA_API_KEY ? process.env.NINJA_API_KEY : '',
  NINJAS_URL: 'https://api.api-ninjas.com/v1/nutrition',
});
