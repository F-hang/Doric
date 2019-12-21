/*
 * Copyright [2019] [Doric.Pub]
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
//
//  DoricContext.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import <Foundation/Foundation.h>
#import "DoricDriver.h"
#import "DoricNavigatorDelegate.h"
#import "DoricNavBarDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@class DoricViewNode;
@class DoricRootNode;

@interface DoricContext : NSObject
@property(nonatomic, weak) id <DoricNavigatorDelegate> navigator;
@property(nonatomic, weak) id <DoricNavBarDelegate> navBar;
@property(nonatomic, strong) NSString *contextId;
@property(nonatomic, strong) DoricDriver *driver;
@property(nonatomic, strong) NSMutableDictionary *pluginInstanceMap;
@property(nonatomic, strong) NSString *source;
@property(nonatomic, strong) NSString *script;;
@property(nonatomic, strong) NSMutableDictionary *initialParams;
@property(nonatomic, strong) DoricRootNode *rootNode;
@property(nonatomic, strong) NSMutableDictionary <NSString *, DoricViewNode *> *headNodes;

- (instancetype)initWithScript:(NSString *)script source:(NSString *)source;

- (DoricAsyncResult *)callEntity:(NSString *)method, ...;

- (DoricAsyncResult *)callEntity:(NSString *)method withArguments:(va_list)args;

- (DoricAsyncResult *)callEntity:(NSString *)method withArgumentsArray:(NSArray *)args;

- (void)initContextWithWidth:(CGFloat)width height:(CGFloat)height;

- (void)reload:(NSString *)script;

- (void)onShow;

- (void)onHidden;

- (DoricViewNode *)targetViewNode:(NSString *)viewId;
@end

NS_ASSUME_NONNULL_END