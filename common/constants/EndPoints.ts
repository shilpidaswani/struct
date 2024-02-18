import { Store } from "src/app/core/store/store";
import { environment } from "src/environments/environment";

const EndPoints = {
    production: false,
    HOST_URL: "",
    theme: 'light',

    //URL Constants
    SIGNUP: "",
    LOGOUT: "",


    api: {
        core: {
            base: environment.base_url + "api",
        } as Store.APIConfig,

        auth: {
            sendotp: {
                endpoint: '/user/getOTP'
            },
            verifyotp: {
                endpoint: '/user/verifyOTP'
            },
            signup: {
                endpoint: '/user/signup'
            },
            // getuser: {
            //     endpoint: '/user/getUserById/{userId}'
            // },
            getuser: {
                endpoint: '/user/getUserById'
            },
            loginUsingEmail: {
                endpoint: '/user/login'
            },
            loginUsingPhone: {
                endpoint: '/user/login'
            },
            getfeed: {
                endpoint: '/user/feed?id={userId}'
            },
            getuserfeed: {
                endpoint: '/post/getAll'
            },
            updateUser: {
                endpoint: '/user/updateUserDetails'
            },
            postReaction: {
                endpoint: '/reaction/post-reaction'
            },
            refreshToken: {
                endpoint: '/user/refresh-token'
            },
            prompts: {
                endpoint: '/prompt/getAllPrompts'
            },
            CreatePrompt: {
                endpoint: '/prompt/create'
            },
            logout: {
                endpoint: '/user/logout'
            }
        } as Store.APIConfigGroup,

        master: {
            serviceMaster: {
                endpoint: "/master/serviceMaster"
            },
            roles: {
                endpoint: '/master/roleMaster'
            },
            interests: {
                endpoint: '/master/interestMaster'
            },
            promptQuestions: {
                endpoint: '/master/promptsQuestions'
            }
        } as Store.APIConfigGroup,

        user:
            {
                login: "/user/login"
            } as Store.APIConfigGroup,

        media: {
            endpoint: '/media'
        },
        deleteMedia: {
            endpoint: '/media/deleteMedia'
        },
        follow: {
            endpoint: '/follow'
        },
        users: {
            endpoint: '/user/getFilteredListOfUsers'
        },
        post: {
            endpoint: '/post'
        },
        deletePrompt: {
            endpoint: '/prompt/deletePrompt/'
        },
        updatePrompt: {
            endpoint: '/prompt/updatePrompt/'
        },
        searchlocation: {
            endpoint: '/user/people-within/50/center/'
        },
        getuserfromlocation: {
            endpoint: '/user/getUsersByPlaceId/{placeId}'
            // endpoint: '/user/{placeId}'
        },
        searchworkplace: {
            endpoint: '/workplace/workplace-within/{radius}/center/'
        },
        comment: {
            endpoint: '/comment'
        },
        getcomment: {
            endpoint: '/comment/'
        },
        checkin: {
            endpoint: '/post'
        },
        checkout: {
            endpoint: '/user/checkout'
        },
        tipHistory: {
            endpoint: '/payment'
        },
        saveTransaction: {
            endpoint: '/payment'
        },
        getScheduledEventsById : {
            endpoint: '/schedule/get-all-events?creator={creator}&page={page}&pageSize={pageSize}'  
        },
        schedule: {
            endpoint: '/schedule/schedule-event'
        },
        device:{
            endpoint: '/device'
        },
        deleteSchedule:{
            endpoint:'/schedule/delete-event'
        }
    }
};
export default EndPoints
