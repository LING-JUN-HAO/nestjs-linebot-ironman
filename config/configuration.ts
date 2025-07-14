import * as Joi from 'joi';

/**
 * 配置驗證模式
 * 使用 Joi 定義配置的結構和驗證規則。
 */
const configSchema = Joi.object({
  // Line Bot 相關設定
  line: Joi.object({
    channelAccessToken: Joi.string().required(), // 字串且必填
    channelSecret: Joi.string().required(), // 字串且必填
  }).required(), // 必填

  // OpenWeatherMap 相關設定
  weather: Joi.object({
    baseUrl: Joi.string().uri().required(), // uri 格式且必填
    apiKey: Joi.string().required(), // 字串且必填
  }).required(), // 必填

  // Cloudinary 相關設定
  cloudinary: Joi.object({
    cloudName: Joi.string().required(), // Cloudinary Cloud Name (字串且必填)
    apiKey: Joi.string().required(), // Cloudinary API Key (字串且必填)
    apiSecret: Joi.string().required(), // Cloudinary API Secret (字串且必填)
  }).required(), // 必填

  // 伺服器基本設定
  nodeEnv: Joi.string()
    .valid('development', 'production', 'test') // 僅能從這些值中選擇
    .default('development'), // 預設值是 development(如果未設定的情況下套用)
  port: Joi.number().port().default(3000), // 數字且是有效的端口號，預設值是 3000
});

/**
 * 配置驗證模組
 * 使用 Joi 進行配置驗證，確保環境變數符合預期格式。
 * @returns {Object} 驗證後的配置對象
 * @throws {Error} 如果驗證失敗，則拋出錯誤
 */
export default () => {
  const config = {
    // Line Bot 相關設定
    line: {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    },

    // OpenWeatherMap 相關設定
    weather: {
      baseUrl: process.env.WEATHER_BASE_URL,
      apiKey: process.env.WEATHER_API_KEY,
    },

    // Cloudinary 相關設定
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    // 伺服器基本設定
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
  };

  const { error, value } = configSchema.validate(config, {
    abortEarly: false, // 顯示所有錯誤，而不是第一個錯誤就停止檢查
  });

  if (error) throw new Error(`環境變數驗證錯誤: ${error.message}`);

  return value;
};
