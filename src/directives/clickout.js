export default {
  // 初始化指令
  mounted(el, binding) {
    function clickHandler(e) {
      // 如果点击的不是本身则调用函数
      if (el.contains(e.target)) return false;
      // 判断指令中是否绑定了函数,函数名是否存在
      if (binding.value && typeof binding.value === 'function') {
        binding.value(e)
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__click_out = clickHandler;
    document.addEventListener("click", clickHandler);
  },
  beforeMount(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.__click_out);
    delete el.__click_out;
  },
};
