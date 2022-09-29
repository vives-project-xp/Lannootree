import Controller from "./controller/controller.js";
import ClientAPI from "./client-api/client-api.js";
import FirmwareAPI from "./firmware-api/firmware-api.js";
import AssetAPI from "./asset-api/asset-api.js"

const controller = new Controller();
const clientAPI = new ClientAPI();
const firmwareAPI = new FirmwareAPI();
const assetAPI = new AssetAPI();


controller.main();
clientAPI.main(controller);
firmwareAPI.main();
assetAPI.main();