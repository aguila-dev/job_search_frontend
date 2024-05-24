import axios from 'axios';

export const loginOrSignup = async (
  email: string,
  password: string,
  auth: string
) => {
  try {
    const { data } = await axios.post(`/v1/api/auth/${auth}`, {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await axios.post('/v1/api/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
