
const rules ={
  name: [{ required: true, message: "不能为空", trigger: "blur" }],
  firstName: [{ required: true, message: "姓不能为空", trigger: "blur" }],
  lastName: [{ required: true, message: "名不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    {
      pattern: /^1\d{10}$/,
      message: "请输入正确手机号码",
      trigger: "blur",
    },
  ],
  mail: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  referal_email: [
    { required: false, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  shoeSizeOrder: [
    {
      required: true,
      type: "object",
      message: "请选择鞋码",
      trigger: "change",
      fields: {
        id: { type: "number", required: true, message: "请选择鞋码" },
        ean: { type: "string", required: true, message: "请选择鞋码" },
      },
    },
  ],
  orderRegion: [
    {
      required: false,
      message: "请选择门店",
      trigger: "change",
      type: "number",
    },
  ],
  color: [
    {
      required: true,
      type: "object",
      message: "请选择颜色",
      trigger: "change",
      fields: {
        product_id: {
          type: "string",
          required: true,
          message: "请选择颜色",
        },
        product_image: {
          type: "string",
          required: true,
          message: "请选择颜色",
        },
      },
    },
  ],
  times: [
    {
      required: true,
      type: "object",
      message: "请选择颜色",
      trigger: "change",
      fields: {
        product_id: {
          type: "string",
          required: true,
          message: "请选择颜色",
        },
        product_image: {
          type: "string",
          required: true,
          message: "请选择颜色",
        },
      },
    },
  ],
  date: [
    {
      required: true,
      type: "string",
      message: "不能为空",
      trigger: "change",
    },
  ],
  jobFile: [
    {
      required: true,
      type: "object",
      message: "请选择简历",
      trigger: "change",
      fields: {
        url: { type: "string", required: true, message: "请上传简历" },
      }
    },
  ],
}
export  default rules
