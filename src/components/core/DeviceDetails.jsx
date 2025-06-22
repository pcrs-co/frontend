export default function DeviceDetails() {

    return (
        <>
            <div className="card lg:card-side bg-base-100 shadow-sm">
                <figure>
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                        alt="Album" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">Device Name</h2>
                    <p>Click the button to contact and notify vendor.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Vendor</button>
                    </div>
                </div>
            </div>
        </>
    )
}