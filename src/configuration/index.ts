export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: process.env
    .CLEAN_NEST_MONGO_CONNECTION_STRING||"mongodb://127.0.0.1:27017/online_messaging",
};
   