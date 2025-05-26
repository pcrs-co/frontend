import { ToastContainer as Container } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ToastContainer() {
    return (
        <Container
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    )
}

export default ToastContainer