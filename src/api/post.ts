/**
 * 帖子接口
 */
import request from "@/utils/vrequest";

/**
 *  添加帖子信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function addPost(params: object) {
    return request({
        method: "post",
        url: "/api/v1/post",
        data: params,
    });
}
/**
 *  删除帖子信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function delPost(id: string) {
    return request({
        method: "delete",
        url: `/api/v1/post/${id}`,
    });
}
/**
 *  更新帖子信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function updatePost(id: string, params: object) {
    return request({
        method: "put",
        url: `/api/v1/post/${id}`,
        data: params,
    });
}
/**
 *  获取帖子信息列表
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function post(params: object) {
    return request({
        method: "get",
        url: "/api/v1/post",
        params,
    });
}
