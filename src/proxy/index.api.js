// let depUrl=''
let depUrl='/index/deplist'
let depUrl2='/index/joblist'
let depUrl3='/index/add'
let PerUrl='/index/Perlist'
let ProfileUrl='/index/getprofile'
let delUrl='/index/del'
let callUrl='/index/call'
let editUrl='/index/edit'
let searchUrl='/index/search'

import {devHttp} from '@/services/request.js'

const $http=devHttp;

/**
 * 用户登录
 */
export const getDepList = (data) => {
    return $http.post(depUrl, data)
};
export const getJobList = (data) => {
    return $http.post(depUrl2, data)
};
export const add = (data) => {
    return $http.post(depUrl3, data)
};
export const PerList = (data) => {
    return $http.post(PerUrl, data)
};
export const getProfile = (data) => {
    return $http.post(ProfileUrl, data)
};
export const Delete = (data) => {
    return $http.post(delUrl, data)
};
export const Call = (data) => {
    return $http.post(callUrl, data)
};
export const edit = (data) => {
    return $http.post(editUrl, data)
};
export const getDepListBySearch = (data) => {
    return $http.post(searchUrl, data)
};