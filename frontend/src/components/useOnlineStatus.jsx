import { useState, useEffect } from "react";

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);   // browser online
    window.addEventListener("offline", goOffline); // browser offline

    window.addEventListener("focus", goOnline);    // tab focused
    window.addEventListener("blur", goOffline);    // tab blurred

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("focus", goOnline);
      window.removeEventListener("blur", goOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
