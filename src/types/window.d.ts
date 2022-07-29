import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import type { LoadingBarApiInjection } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";

// 申明window全局naive组件Api
declare global {
  interface Window {
    $loadingBar: LoadingBarApiInjection;
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $notification: NotificationApiInjection;
    // currentTarget: {
    //   innerWidth: number;
    // };
  }
}

