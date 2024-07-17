import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Lottie from "lottie-react";
import ChecklistOnly from "@/assets/lottie/checklist-only.json";
import Warning from "@/assets/lottie/warning.json";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center w-full gap-2">
              <div className="-ml-[20px]">
                <Lottie
                  style={{ width: 55 }}
                  animationData={
                    variant === "success" ? ChecklistOnly : Warning
                  }
                  loop={true}
                  autoPlay
                />
              </div>
              <div className="w-full -ml-2">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="mt-[3px]">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
