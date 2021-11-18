/*
 * Copyright [2021] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Resource } from "../util/resource"
import { BridgeContext } from "../runtime/global"

export function imageDecoder(context: BridgeContext) {
    return {
        decode: async (resource: Resource) => {
            await context.callNative('imageDecoder', 'loadResource', resource);
            const imageInfo = await context.callNative(
                'imageDecoder',
                'getImageInfo',
                resource.resId) as Promise<
                    {
                        width: number,
                        height: number,
                        format: string,
                    }>;
            const pixels = await context.callNative(
                'imageDecoder',
                'decodeToPixels',
                resource.resId) as Promise<ArrayBuffer>;
            await context.callNative('imageDecoder', 'releaseResource', resource.resId);
            return {
                ...imageInfo,
                pixels,
            };
        },
    }
}