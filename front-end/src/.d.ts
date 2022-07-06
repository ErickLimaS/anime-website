// declare module 'react-html-parser' {
//     import { ReactElement } from 'react';

//     export default function ReactHtmlParser(
//         html: string,
//         options?: {
//             decodeEntities?: boolean;
//             transform?: (
//                 node: {
//                     type: string;
//                     name: string;
//                     children: any[];
//                     next: any;
//                     prev: any;
//                     parent: any;
//                     data: string;
//                 },
//                 index: number
//             ) => ReactElement<any> | undefined | null;
//             preprocessNodes?: (nodes: any) => any;
//         }
//     ): ReactElement<any>;
// }