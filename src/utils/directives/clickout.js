export default {
  // 初始化指令
  mounted(el, binding) {
    el._clickout_ = clickHandler;// 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    document.addEventListener("click", clickHandler);
    function clickHandler(e) {
      if (el.contains(e.target)) return false; // 如果点击的是自身则退出函数
      if (binding.value && typeof binding.value === 'function') {// 判断指令中是否绑定了函数,函数名是否存在

        console.log(binding)
        binding.value(e); // 调用绑定的函数,并将点击元素传入
      }
    }
  },
  beforeMount(el, binding) {
    document.removeEventListener("click", el._clickout_);// 解除事件监听
    delete el._clickout_;
  },
};
