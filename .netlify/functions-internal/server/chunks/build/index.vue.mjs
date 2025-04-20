import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { mergeProps, useSSRContext, withCtx, createVNode } from 'vue';

const _sfc_main$5 = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "bg-white shadow-md py-4 px-6 flex justify-between items-center" }, _attrs))}><div class="text-2xl font-bold lowercase text-gray-900">rundoc</div><nav class="hidden md:flex space-x-6 text-sm font-medium text-gray-700"><a href="#" class="hover:text-blue-600">home</a><a href="#" class="hover:text-blue-600">doctors</a><a href="#" class="hover:text-blue-600">clinics</a></nav><div class="flex items-center space-x-4"><button class="text-black hover:text-blue-600"><i class="fas fa-search"></i></button><button class="text-black hover:text-blue-600"><i class="fas fa-shopping-cart"></i></button><button class="px-4 py-1 border border-black text-sm text-black rounded hover:bg-black hover:text-white transition"> Login/Register </button></div></header>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};

const _sfc_main$4 = {
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "text-center py-16 px-4 bg-gray-50" }, _attrs))}><h2 class="text-green-600 text-xs font-bold uppercase"> India’s Largest Doctor Appointment Booking Platform </h2><h1 class="text-3xl md:text-5xl font-bold text-gray-800 mt-2"> Search Doctor, Make an Appointment </h1><p class="text-gray-600 mt-2"> Discover the best doctors &amp; clinics in the city nearest you </p><div class="mt-6 flex flex-col md:flex-row justify-center items-center gap-4"><input type="text" placeholder="Search Doctor" class="border px-4 py-2 w-full md:w-96 rounded"><button class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"> Search </button></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};

const _sfc_main$3 = {
  __name: "ServiceCard",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: String,
    bgColor: String,
    descColor: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: `flex items-center justify-between px-4 py-6 rounded-xl ${__props.bgColor}`
      }, _attrs))}><div class="flex items-center gap-8"><div class="text-4xl">`);
      ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push, _parent);
      _push(`</div><div><h3 class="text-lg font-semibold text-black">${ssrInterpolate(__props.title)}</h3><p class="${ssrRenderClass(`text-xs uppercase font-medium tracking-wider py-.5 ${__props.descColor}`)}">${ssrInterpolate(__props.description)}</p></div></div><div class="text-black text-base font-semibold"><i class="fas fa-chevron-right"></i></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};

const _sfc_main$2 = {
  __name: "ServiceGrid",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-10 px-4 bg-white" }, _attrs))}><h2 class="text-center text-2xl font-bold text-gray-800 mb-8"> What are you looking for? </h2><div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Buy Medicines & Essentials",
        description: "2hrs delivery",
        bgColor: "bg-green-100",
        descColor: "text-green-800"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-capsules text-green-800"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", { class: "fas fa-capsules text-green-800" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Doctor Appointment",
        description: "Book now",
        bgColor: "bg-yellow-100",
        descColor: "text-yellow-800"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-user-md text-yellow-800"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", { class: "fas fa-user-md text-yellow-800" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Lab Tests",
        description: "At home",
        bgColor: "bg-pink-100",
        descColor: "text-pink-800"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-vial text-pink-800"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", { class: "fas fa-vial text-pink-800" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Health Insurance",
        description: "Explore plans",
        bgColor: "bg-orange-100",
        descColor: "text-orange-800"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-notes-medical text-orange-800"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", { class: "fas fa-notes-medical text-orange-800" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};

const _sfc_main$1 = {
  __name: "LandingLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/LandingLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue.mjs.map
