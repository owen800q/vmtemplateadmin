/**
 * 通知接口
 */
import request from "@/utils/vrequest";

/**
 *  添加通知信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function addNotice(params: object) {
    return request({
        method: "post",
        url: "/api/v1/notice",
        data: params,
    });
}
/**
 *  删除通知信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function delNotice(id: string) {
    return request({
        method: "delete",
        url: `/api/v1/notice/${id}`,
    });
}
/**
 *  更新通知信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function updateNotice(id: string, params: object) {
    return request({
        method: "put",
        url: `/api/v1/notice/${id}`,
        data: params,
    });
}
/**
 *  获取通知信息列表
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function notice(params: object) {
    return request({
        method: "get",
        url: "/api/v1/notice",
        params,
    });
}
