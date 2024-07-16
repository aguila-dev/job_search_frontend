import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import { me } from "./redux/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!data?.auth) {
      dispatch(me());
    }
  }, [data]);

  return <AppRoutes />;
}

export default App;
