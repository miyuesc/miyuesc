import * as AV from "leancloud-storage";
import config from "@/config";

AV.init({
  appId: config.leanCloud.appId,
  appKey: config.leanCloud.appKey
});

export default AV;
