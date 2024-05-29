import axios from 'axios';

export const loginOrSignup = async (
  email: string,
  password: string,
  method: string,
  firstName?: string,
  lastName?: string
) => {
  try {
    console.log('Method in auth frontend\n:', method);
    const { data } = await axios.post(
      `http://localhost:8000/v1/auth/${method}`,
      {
        email,
        password,
        firstName,
        lastName,
      },
      { withCredentials: true }
    );
    console.log('Data in auth frontend\n:', data);
    return data;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post('http://localhost:8000/v1/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
