/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./context/AuthContext.js":
/*!********************************!*\
  !*** ./context/AuthContext.js ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/api */ \"./lib/api.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_api__WEBPACK_IMPORTED_MODULE_3__, js_cookie__WEBPACK_IMPORTED_MODULE_4__]);\n([_lib_api__WEBPACK_IMPORTED_MODULE_3__, js_cookie__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        checkAuth();\n    }, []);\n    const checkAuth = async ()=>{\n        try {\n            const token = js_cookie__WEBPACK_IMPORTED_MODULE_4__[\"default\"].get(\"token\");\n            if (token) {\n                const { data } = await _lib_api__WEBPACK_IMPORTED_MODULE_3__[\"default\"].get(\"/auth/me\");\n                setUser(data.user);\n            }\n        } catch (error) {\n            console.error(\"Auth check failed:\", error);\n            js_cookie__WEBPACK_IMPORTED_MODULE_4__[\"default\"].remove(\"token\");\n        } finally{\n            setLoading(false);\n        }\n    };\n    const login = async (email, password)=>{\n        const { data } = await _lib_api__WEBPACK_IMPORTED_MODULE_3__[\"default\"].post(\"/auth/login\", {\n            email,\n            password\n        });\n        js_cookie__WEBPACK_IMPORTED_MODULE_4__[\"default\"].set(\"token\", data.token, {\n            expires: 7\n        });\n        setUser(data.user);\n        return data.user;\n    };\n    const register = async (name, email, password, role = \"STUDENT\")=>{\n        const { data } = await _lib_api__WEBPACK_IMPORTED_MODULE_3__[\"default\"].post(\"/auth/register\", {\n            name,\n            email,\n            password,\n            role\n        });\n        js_cookie__WEBPACK_IMPORTED_MODULE_4__[\"default\"].set(\"token\", data.token, {\n            expires: 7\n        });\n        setUser(data.user);\n        return data.user;\n    };\n    const logout = async ()=>{\n        try {\n            await _lib_api__WEBPACK_IMPORTED_MODULE_3__[\"default\"].post(\"/auth/logout\");\n        } catch (error) {\n            console.error(\"Logout error:\", error);\n        } finally{\n            js_cookie__WEBPACK_IMPORTED_MODULE_4__[\"default\"].remove(\"token\");\n            setUser(null);\n            router.push(\"/login\");\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            loading,\n            login,\n            register,\n            logout,\n            checkAuth\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"D:\\\\Web Development\\\\Online-Learning-Platform\\\\frontend\\\\context\\\\AuthContext.js\",\n        lineNumber: 64,\n        columnNumber: 5\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!context) {\n        throw new Error(\"useAuth must be used within AuthProvider\");\n    }\n    return context;\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L0F1dGhDb250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXVFO0FBQy9CO0FBQ0w7QUFDSDtBQUVoQyxNQUFNTyw0QkFBY1Asb0RBQWFBO0FBRTFCLE1BQU1RLGVBQWUsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDdkMsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdULCtDQUFRQSxDQUFDO0lBQ2pDLE1BQU0sQ0FBQ1UsU0FBU0MsV0FBVyxHQUFHWCwrQ0FBUUEsQ0FBQztJQUN2QyxNQUFNWSxTQUFTVixzREFBU0E7SUFFeEJELGdEQUFTQSxDQUFDO1FBQ1JZO0lBQ0YsR0FBRyxFQUFFO0lBRUwsTUFBTUEsWUFBWTtRQUNoQixJQUFJO1lBQ0YsTUFBTUMsUUFBUVYscURBQVcsQ0FBQztZQUMxQixJQUFJVSxPQUFPO2dCQUNULE1BQU0sRUFBRUUsSUFBSSxFQUFFLEdBQUcsTUFBTWIsb0RBQWEsQ0FBQztnQkFDckNNLFFBQVFPLEtBQUtSLElBQUk7WUFDbkI7UUFDRixFQUFFLE9BQU9TLE9BQU87WUFDZEMsUUFBUUQsS0FBSyxDQUFDLHNCQUFzQkE7WUFDcENiLHdEQUFjLENBQUM7UUFDakIsU0FBVTtZQUNSTyxXQUFXO1FBQ2I7SUFDRjtJQUVBLE1BQU1TLFFBQVEsT0FBT0MsT0FBT0M7UUFDMUIsTUFBTSxFQUFFTixJQUFJLEVBQUUsR0FBRyxNQUFNYixxREFBYyxDQUFDLGVBQWU7WUFBRWtCO1lBQU9DO1FBQVM7UUFDdkVsQixxREFBVyxDQUFDLFNBQVNZLEtBQUtGLEtBQUssRUFBRTtZQUFFVyxTQUFTO1FBQUU7UUFDOUNoQixRQUFRTyxLQUFLUixJQUFJO1FBQ2pCLE9BQU9RLEtBQUtSLElBQUk7SUFDbEI7SUFFQSxNQUFNa0IsV0FBVyxPQUFPQyxNQUFNTixPQUFPQyxVQUFVTSxPQUFPLFNBQVM7UUFDN0QsTUFBTSxFQUFFWixJQUFJLEVBQUUsR0FBRyxNQUFNYixxREFBYyxDQUFDLGtCQUFrQjtZQUN0RHdCO1lBQ0FOO1lBQ0FDO1lBQ0FNO1FBQ0Y7UUFDQXhCLHFEQUFXLENBQUMsU0FBU1ksS0FBS0YsS0FBSyxFQUFFO1lBQUVXLFNBQVM7UUFBRTtRQUM5Q2hCLFFBQVFPLEtBQUtSLElBQUk7UUFDakIsT0FBT1EsS0FBS1IsSUFBSTtJQUNsQjtJQUVBLE1BQU1xQixTQUFTO1FBQ2IsSUFBSTtZQUNGLE1BQU0xQixxREFBYyxDQUFDO1FBQ3ZCLEVBQUUsT0FBT2MsT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsaUJBQWlCQTtRQUNqQyxTQUFVO1lBQ1JiLHdEQUFjLENBQUM7WUFDZkssUUFBUTtZQUNSRyxPQUFPa0IsSUFBSSxDQUFDO1FBQ2Q7SUFDRjtJQUVBLHFCQUNFLDhEQUFDekIsWUFBWTBCLFFBQVE7UUFBQ0MsT0FBTztZQUFFeEI7WUFBTUU7WUFBU1U7WUFBT007WUFBVUc7WUFBUWhCO1FBQVU7a0JBQzlFTjs7Ozs7O0FBR1AsRUFBRTtBQUVLLE1BQU0wQixVQUFVO0lBQ3JCLE1BQU1DLFVBQVVuQyxpREFBVUEsQ0FBQ007SUFDM0IsSUFBSSxDQUFDNkIsU0FBUztRQUNaLE1BQU0sSUFBSUMsTUFBTTtJQUNsQjtJQUNBLE9BQU9EO0FBQ1QsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2xlYXJuaW5nLXBsYXRmb3JtLWZyb250ZW5kLy4vY29udGV4dC9BdXRoQ29udGV4dC5qcz8xMzk4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5pbXBvcnQgYXBpQ2xpZW50IGZyb20gJy4uL2xpYi9hcGknO1xuaW1wb3J0IENvb2tpZXMgZnJvbSAnanMtY29va2llJztcblxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjaGVja0F1dGgoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGNoZWNrQXV0aCA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdG9rZW4gPSBDb29raWVzLmdldCgndG9rZW4nKTtcbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGFwaUNsaWVudC5nZXQoJy9hdXRoL21lJyk7XG4gICAgICAgIHNldFVzZXIoZGF0YS51c2VyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignQXV0aCBjaGVjayBmYWlsZWQ6JywgZXJyb3IpO1xuICAgICAgQ29va2llcy5yZW1vdmUoJ3Rva2VuJyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBsb2dpbiA9IGFzeW5jIChlbWFpbCwgcGFzc3dvcmQpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGFwaUNsaWVudC5wb3N0KCcvYXV0aC9sb2dpbicsIHsgZW1haWwsIHBhc3N3b3JkIH0pO1xuICAgIENvb2tpZXMuc2V0KCd0b2tlbicsIGRhdGEudG9rZW4sIHsgZXhwaXJlczogNyB9KTtcbiAgICBzZXRVc2VyKGRhdGEudXNlcik7XG4gICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgfTtcblxuICBjb25zdCByZWdpc3RlciA9IGFzeW5jIChuYW1lLCBlbWFpbCwgcGFzc3dvcmQsIHJvbGUgPSAnU1RVREVOVCcpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGFwaUNsaWVudC5wb3N0KCcvYXV0aC9yZWdpc3RlcicsIHtcbiAgICAgIG5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgcm9sZSxcbiAgICB9KTtcbiAgICBDb29raWVzLnNldCgndG9rZW4nLCBkYXRhLnRva2VuLCB7IGV4cGlyZXM6IDcgfSk7XG4gICAgc2V0VXNlcihkYXRhLnVzZXIpO1xuICAgIHJldHVybiBkYXRhLnVzZXI7XG4gIH07XG5cbiAgY29uc3QgbG9nb3V0ID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcGlDbGllbnQucG9zdCgnL2F1dGgvbG9nb3V0Jyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0xvZ291dCBlcnJvcjonLCBlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIENvb2tpZXMucmVtb3ZlKCd0b2tlbicpO1xuICAgICAgc2V0VXNlcihudWxsKTtcbiAgICAgIHJvdXRlci5wdXNoKCcvbG9naW4nKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdXNlciwgbG9hZGluZywgbG9naW4sIHJlZ2lzdGVyLCBsb2dvdXQsIGNoZWNrQXV0aCB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZUF1dGggPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gQXV0aFByb3ZpZGVyJyk7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59O1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJhcGlDbGllbnQiLCJDb29raWVzIiwiQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwibG9hZGluZyIsInNldExvYWRpbmciLCJyb3V0ZXIiLCJjaGVja0F1dGgiLCJ0b2tlbiIsImdldCIsImRhdGEiLCJlcnJvciIsImNvbnNvbGUiLCJyZW1vdmUiLCJsb2dpbiIsImVtYWlsIiwicGFzc3dvcmQiLCJwb3N0Iiwic2V0IiwiZXhwaXJlcyIsInJlZ2lzdGVyIiwibmFtZSIsInJvbGUiLCJsb2dvdXQiLCJwdXNoIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUF1dGgiLCJjb250ZXh0IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./context/AuthContext.js\n");

/***/ }),

/***/ "./lib/api.js":
/*!********************!*\
  !*** ./lib/api.js ***!
  \********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, js_cookie__WEBPACK_IMPORTED_MODULE_1__]);\n([axios__WEBPACK_IMPORTED_MODULE_0__, js_cookie__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nconst API_BASE_URL = \"http://localhost:5000/api\" || 0;\nconst apiClient = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n    baseURL: API_BASE_URL,\n    headers: {\n        \"Content-Type\": \"application/json\"\n    },\n    withCredentials: true\n});\n// Add token to requests\napiClient.interceptors.request.use((config)=>{\n    const token = js_cookie__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get(\"token\");\n    if (token) {\n        config.headers.Authorization = `Bearer ${token}`;\n    }\n    return config;\n});\n// Handle response errors\napiClient.interceptors.response.use((response)=>response, (error)=>{\n    if (error.response?.status === 401) {\n        // Clear token and redirect to login\n        js_cookie__WEBPACK_IMPORTED_MODULE_1__[\"default\"].remove(\"token\");\n        if (false) {}\n    }\n    return Promise.reject(error);\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiClient);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvYXBpLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUEwQjtBQUNNO0FBRWhDLE1BQU1FLGVBQWVDLDJCQUErQixJQUFJO0FBRXhELE1BQU1HLFlBQVlOLG9EQUFZLENBQUM7SUFDN0JRLFNBQVNOO0lBQ1RPLFNBQVM7UUFDUCxnQkFBZ0I7SUFDbEI7SUFDQUMsaUJBQWlCO0FBQ25CO0FBRUEsd0JBQXdCO0FBQ3hCSixVQUFVSyxZQUFZLENBQUNDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUNDO0lBQ2xDLE1BQU1DLFFBQVFkLHFEQUFXLENBQUM7SUFDMUIsSUFBSWMsT0FBTztRQUNURCxPQUFPTCxPQUFPLENBQUNRLGFBQWEsR0FBRyxDQUFDLE9BQU8sRUFBRUYsTUFBTSxDQUFDO0lBQ2xEO0lBQ0EsT0FBT0Q7QUFDVDtBQUVBLHlCQUF5QjtBQUN6QlIsVUFBVUssWUFBWSxDQUFDTyxRQUFRLENBQUNMLEdBQUcsQ0FDakMsQ0FBQ0ssV0FBYUEsVUFDZCxDQUFDQztJQUNDLElBQUlBLE1BQU1ELFFBQVEsRUFBRUUsV0FBVyxLQUFLO1FBQ2xDLG9DQUFvQztRQUNwQ25CLHdEQUFjLENBQUM7UUFDZixJQUFJLEtBQWtCLEVBQWEsRUFFbEM7SUFDSDtJQUNBLE9BQU93QixRQUFRQyxNQUFNLENBQUNQO0FBQ3hCO0FBR0YsaUVBQWViLFNBQVNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWFybmluZy1wbGF0Zm9ybS1mcm9udGVuZC8uL2xpYi9hcGkuanM/NDU0MiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IENvb2tpZXMgZnJvbSAnanMtY29va2llJztcblxuY29uc3QgQVBJX0JBU0VfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaSc7XG5cbmNvbnN0IGFwaUNsaWVudCA9IGF4aW9zLmNyZWF0ZSh7XG4gIGJhc2VVUkw6IEFQSV9CQVNFX1VSTCxcbiAgaGVhZGVyczoge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gIH0sXG4gIHdpdGhDcmVkZW50aWFsczogdHJ1ZSwgLy8gSW1wb3J0YW50IGZvciBjb29raWVzXG59KTtcblxuLy8gQWRkIHRva2VuIHRvIHJlcXVlc3RzXG5hcGlDbGllbnQuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKChjb25maWcpID0+IHtcbiAgY29uc3QgdG9rZW4gPSBDb29raWVzLmdldCgndG9rZW4nKTtcbiAgaWYgKHRva2VuKSB7XG4gICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICB9XG4gIHJldHVybiBjb25maWc7XG59KTtcblxuLy8gSGFuZGxlIHJlc3BvbnNlIGVycm9yc1xuYXBpQ2xpZW50LmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UoXG4gIChyZXNwb25zZSkgPT4gcmVzcG9uc2UsXG4gIChlcnJvcikgPT4ge1xuICAgIGlmIChlcnJvci5yZXNwb25zZT8uc3RhdHVzID09PSA0MDEpIHtcbiAgICAgIC8vIENsZWFyIHRva2VuIGFuZCByZWRpcmVjdCB0byBsb2dpblxuICAgICAgQ29va2llcy5yZW1vdmUoJ3Rva2VuJyk7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xvZ2luJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgfVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpQ2xpZW50O1xuIl0sIm5hbWVzIjpbImF4aW9zIiwiQ29va2llcyIsIkFQSV9CQVNFX1VSTCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19BUElfVVJMIiwiYXBpQ2xpZW50IiwiY3JlYXRlIiwiYmFzZVVSTCIsImhlYWRlcnMiLCJ3aXRoQ3JlZGVudGlhbHMiLCJpbnRlcmNlcHRvcnMiLCJyZXF1ZXN0IiwidXNlIiwiY29uZmlnIiwidG9rZW4iLCJnZXQiLCJBdXRob3JpemF0aW9uIiwicmVzcG9uc2UiLCJlcnJvciIsInN0YXR1cyIsInJlbW92ZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIlByb21pc2UiLCJyZWplY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/api.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AuthContext */ \"./context/AuthContext.js\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_context_AuthContext__WEBPACK_IMPORTED_MODULE_1__]);\n_context_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"D:\\\\Web Development\\\\Online-Learning-Platform\\\\frontend\\\\pages\\\\_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\Web Development\\\\Online-Learning-Platform\\\\frontend\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBc0Q7QUFDdkI7QUFFL0IsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQyxxQkFDRSw4REFBQ0gsOERBQVlBO2tCQUNYLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWFybmluZy1wbGF0Zm9ybS1mcm9udGVuZC8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0L0F1dGhDb250ZXh0JztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPEF1dGhQcm92aWRlcj5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0F1dGhQcm92aWRlcj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "js-cookie":
/*!****************************!*\
  !*** external "js-cookie" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = import("js-cookie");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();