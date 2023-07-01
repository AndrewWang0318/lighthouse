const cc_name = 'cc';
const cc_img = "cc.png";
const cc_cn_name = "曹操";
const cc_react = {w:2,h:2};

const hz_name = 'hz';
const hz_img = "hz.png";
const hz_cn_name = "黄忠";
const hz_react = {w:1,h:2};

const mc_name = 'mc';
const mc_img = "mc.png";
const mc_cn_name = "马超";
const mc_react = {w:1,h:2};

const zf_name = 'zf';
const zf_img = "zf.png";
const zf_cn_name = "张飞";
const zf_react = {w:1,h:2};

const gy_name = 'gy';
const gy_img = "gy.png";
const gy_cn_name = "关羽";
const gy_react = {w:2,h:1};

const zy_name = 'gy';
const zy_img = "zy.png";
const zy_cn_name = "赵云";
const zy_react = {w:1,h:2};

const xb_name = 'xb';
const xb_img = "xb.png";
const xb_cn_name = "士";
const xb_react = {w:1,h:1};

export default {
  level1:{
    name:'横刀立马',
    data:[
      [hz_react.w, hz_react.h, [0, 0], hz_img, hz_name, hz_cn_name],
      [cc_react.w, cc_react.h, [1, 0], cc_img, cc_name, cc_cn_name],
      [mc_react.w, mc_react.h, [3, 0], mc_img, mc_name, mc_cn_name],
      [zf_react.w, zf_react.h, [0, 2], zf_img, zf_name, zf_cn_name],
      [gy_react.w, gy_react.h, [1, 2], gy_img, gy_name, gy_cn_name],
      [zy_react.w, zy_react.h, [3, 2], zy_img, zy_name, zy_cn_name],

      [xb_react.w, xb_react.h, [1, 3], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [2, 3], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [0, 4], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [3, 4], xb_img, xb_name, xb_cn_name],
    ]
  },
  level2:{
    name:'指挥若定',
    data:[
      [hz_react.w, hz_react.h, [0, 0], hz_img, hz_name, hz_cn_name],
      [cc_react.w, cc_react.h, [1, 0], cc_img, cc_name, cc_cn_name],
      [mc_react.w, mc_react.h, [3, 0], mc_img, mc_name, mc_cn_name],
      [zf_react.w, zf_react.h, [0, 3], zf_img, zf_name, zf_cn_name],
      [gy_react.w, gy_react.h, [1, 2], gy_img, gy_name, gy_cn_name],
      [zy_react.w, zy_react.h, [3, 3], zy_img, zy_name, zy_cn_name],

      [xb_react.w, xb_react.h, [1, 3], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [2, 3], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [0, 2], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [3, 2], xb_img, xb_name, xb_cn_name],
    ]
  },
  level3:{
    name:'将拥曹营',
    data:[
      [hz_react.w, hz_react.h, [0, 0], hz_img, hz_name, hz_cn_name],
      [cc_react.w, cc_react.h, [1, 0], cc_img, cc_name, cc_cn_name],
      [mc_react.w, mc_react.h, [3, 0], mc_img, mc_name, mc_cn_name],

      [xb_react.w, xb_react.h, [0, 3], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [3, 3], xb_img, xb_name, xb_cn_name],

      [zf_react.w, zf_react.h, [1, 2], zf_img, zf_name, zf_cn_name],
      [zy_react.w, zy_react.h, [2, 2], zy_img, zy_name, zy_cn_name],
      [gy_react.w, gy_react.h, [0, 4], gy_img, gy_name, gy_cn_name],

      
      [xb_react.w, xb_react.h, [2, 4], xb_img, xb_name, xb_cn_name],
      [xb_react.w, xb_react.h, [3, 4], xb_img, xb_name, xb_cn_name],
    ]
  },
};
