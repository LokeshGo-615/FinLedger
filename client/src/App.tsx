import { AppRouter } from "./routes/AppRouter";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import { setSessionExpiredHandler } from "./api/axios";
import { Toaster } from "sonner";

function App() {

  const initialize = useAuthStore(
  (state) => state.initialize
);

useEffect(() => {
  setSessionExpiredHandler(() => {
    useAuthStore.getState().clearSession();
  });

  void initialize();
}, [initialize]);

return (
  <>
    <AppRouter />

    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />
  </>
)
}

export default App;