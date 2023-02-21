import { writable } from "svelte/store";
import doCall from '../utilities/fetchBackend.js';

export default writable (
    await doCall('http://localhost:3000/users')
);