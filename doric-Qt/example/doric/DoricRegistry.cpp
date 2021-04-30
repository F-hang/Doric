#include "DoricRegistry.h"

#include "plugin/DoricModalPlugin.h"
#include "plugin/DoricNetworkPlugin.h"
#include "plugin/DoricPopoverPlugin.h"
#include "plugin/DoricShaderPlugin.h"

#include "shader/DoricHLayoutNode.h"
#include "shader/DoricImageNode.h"
#include "shader/DoricRootNode.h"
#include "shader/DoricScrollerNode.h"
#include "shader/DoricStackNode.h"
#include "shader/DoricTextNode.h"
#include "shader/DoricVLayoutNode.h"

DoricRegistry::DoricRegistry() {
  registerNativePlugin<DoricShaderPlugin>("shader");
  registerNativePlugin<DoricModalPlugin>("modal");
  registerNativePlugin<DoricPopoverPlugin>("popover");
  registerNativePlugin<DoricNetworkPlugin>("network");

  registerViewNode<DoricRootNode>("Root");
  registerViewNode<DoricStackNode>("Stack");
  registerViewNode<DoricVLayoutNode>("VLayout");
  registerViewNode<DoricHLayoutNode>("HLayout");
  registerViewNode<DoricTextNode>("Text");
  registerViewNode<DoricScrollerNode>("Scroller");
  registerViewNode<DoricImageNode>("Image");
}

bool DoricRegistry::acquirePluginInfo(QString name) {
  return plugins.acquireClass(name);
}

bool DoricRegistry::acquireNodeInfo(QString name) {
  return nodes.acquireClass(name);
}