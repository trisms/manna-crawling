import { BaseApiCall } from '@/api/callInstance/BaseAPICall';
import { JigBaeAPICall } from '@/api/callInstance/JigBaeAPICall';

export const noAuthApiCall = new BaseApiCall(false);

export const jigBaeApiCall = new JigBaeAPICall();
export const apiCall = new BaseApiCall();
