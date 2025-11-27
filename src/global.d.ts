import mitt from 'mitt';
import type Swal from 'sweetalert2';

declare global {
	interface Window {
		$emitter: mitt.Emitter;
		Swal: typeof Swal;
	}
}
