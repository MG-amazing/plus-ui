import {
    checkCardNumberTest,
    checkChineseTest,
    checkEmailTest,
    checkPasswordTest,
    checkPhoneTest, checkUsernameTest
} from '@/utils/validate'

export default function () {
    /**
     * 密码校验
     * @param rule
     * @param value
     * @param callback
     * @param funCallback
     * @returns {*}
     */
    function checkInitPassword(rule, value, callback, funCallback) {
        if (value === '' || value === undefined) {
            callback(new Error('请输入密码'))
        } else if (!checkPasswordTest(value)) {
            callback(new Error('密码必须是包含大小写字母、数字9-20位的组合'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }

    /**
     * 校验邀请码
     * @param rule
     * @param value
     * @param callback
     * @param required
     * @param funCallback
     * @returns {*}
     */
    function checkInvitationCode(rule, value, callback, required, funCallback) {
        if (value === '' || value === undefined) {
            if (required) {
                callback(new Error('请输入8位邀请码'))
            } else {
                callback()
            }
        } else if (value.length !== 8) {
            callback(new Error('邀请码必须是8位'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }

    /**
     * 手机号校验
     * @param rule
     * @param value
     * @param callback
     * @param required
     * @param funCallback
     * @returns {*}
     */
    function checkPhone(rule, value, callback, required, funCallback) {
        if (value === '' || value === undefined) {
            if (required) {
                callback(new Error('请输入手机号'))
            } else {
                callback()
            }
        } else if (!checkPhoneTest(value)) {
            callback(new Error('非法手机号'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }

    /**
     * 邮箱校验
     * @param rule
     * @param value
     * @param callback
     * @param required
     * @param funCallback
     * @returns {*}
     */
    function checkEmail(rule, value, callback, required, funCallback) {
        if (value === '' || value === undefined) {
            if (required) {
                callback(new Error('请输入邮箱'))
            } else {
                callback()
            }
        } else if (!checkEmailTest(value)) {
            callback(new Error('非法邮箱'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }

    /**
     * 身份证号校验
     * @param rule
     * @param value
     * @param callback
     * @param required
     * @param funCallback
     * @returns {*}
     */
    function checkCardNumber(rule, value, callback, required, funCallback) {
        if (value === '' || value === undefined) {
            if (required) {
                callback(new Error('请输入身份证号'))
            } else {
                callback()
            }
        } else if (!checkCardNumberTest(value)) {
            callback(new Error('非法身份证号'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }

    /**
     * 姓名校验
     * @param rule
     * @param value
     * @param callback
     * @param required
     * @param funCallback
     * @returns {*}
     */
    function checkNickname(rule, value, callback, required, funCallback) {
        if (value === '' || value === undefined) {
            if (required) {
                callback(new Error('请输入姓名'))
            } else {
                callback()
            }
        } else if (!checkChineseTest(value)) {
            callback(new Error('姓名必须为中文'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }

    /**
     * 用户名校验
     * @param rule
     * @param value
     * @param callback
     * @param required
     * @param funCallback
     * @returns {*}
     */
    function checkUsername(rule, value, callback, required, funCallback) {
        if (value === '' || value === undefined) {
            if (required) {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        } else if (!checkUsernameTest(value)) {
            callback(new Error('字母开头，允许5-16字节，允许字母数字下划线'))
        } else {
            if (typeof funCallback === 'function') {
                funCallback()
            } else {
                callback()
            }
        }
    }
    return {
        checkInitPassword,
        checkPhone,
        checkEmail,
        checkCardNumber,
        checkInvitationCode,
        checkNickname,
        checkUsername
    }
}
