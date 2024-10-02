import Mock from "mockjs";
import getInfo from './getInfo.json'

Mock.mock("/api/admin/getinfo", { code: 200, data: getInfo })
