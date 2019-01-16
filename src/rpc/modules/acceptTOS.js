import { post } from '../ai2';

// acceptTOS.then((res) => {
// res.status === 302
// });
export const acceptTOS = () => post('/ode/accept_tos');
