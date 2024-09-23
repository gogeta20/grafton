import { ToastSeverity } from "primevue/api";
import { useToast } from "primevue/usetoast";

export const useMeToast = () => {
  const toast = useToast();

  type ToastType = {
    [key: string]: string;
  };

  const toastType: ToastType = {
    success: ToastSeverity.SUCCESS,
    error: ToastSeverity.ERROR,
    info: ToastSeverity.INFO,
    warning: ToastSeverity.WARN,
  };
  const DEFAULT_TYPE = ToastSeverity.SUCCESS;

  const showToast = ({ message = "", title = "", type = DEFAULT_TYPE, life = 5000 }) => {
    const severity = toastType[type];
    if (severity == "info") {
      toast.add({ severity, summary: title, detail: message });
    } else {
      toast.add({ severity, summary: title, detail: message, life });
    }
  };

  const hiddenToast = () => {
    toast.removeAllGroups();
  };

  return {
    showToast, hiddenToast
  };
};
