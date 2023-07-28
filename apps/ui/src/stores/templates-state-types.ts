/* eslint-disable */
import { Unsubscribe } from 'firebase/firestore';
import 'pinia'
import { TemplateV2Creator, TemplateV2 } from 'src/models/template'

declare module 'pinia' {
    export interface TemplatesStateProperties<> {
        $cloudFunctions: any;
        $fbServices: any;
        $router: any;
        $guestCloudFunctions: any;
        newTemplate: TemplateV2;
        loadingTemplates: boolean;
        templates: Array<TemplateV2 & TemplateV2Creator>;
        sharedTemplates: Array<TemplateV2 & TemplateV2Creator>;
        unsubUsersDataListener: Unsubscribe;
    }
}