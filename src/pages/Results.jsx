import DeviceList from "../components/core/DeviceList";

export default function Results() {
    return (
        <div className="space-y-6">
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">

                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold ml-4">Available Devices</h2>
                    </div>

                    <div className="overflow-x-auto bg-base-100 rounded-xl">
                        <table className="table w-full">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Brand</th>
                                    <th className="text-right">Vendor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-base-300 hover:cursor-pointer" onClick={() => document.getElementById('my_modal_2').showModal()}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="John Doe's avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">HP Acer</div>
                                                <div className="text-sm opacity-50">@johndoe</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>1000</td>
                                    <td>HP</td>
                                    <td className="text-right">Acme Inc.</td>
                                </tr>
                            </tbody>
                        </table>

                        <dialog id="my_modal_2" className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Hello!</h3>
                                <p className="py-4">Press ESC key or click outside to close</p>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu text-base-content min-h-full w-100 p-4">
                        {/* Sidebar content here */}
                        <div className="tabs tabs-border">
                            <input type="radio" name="my_tabs_2" className="tab" aria-label="Minimum" />
                            <div className="tab-content border-base-300 bg-base-100 p-10">Tab content 1</div>

                            <input type="radio" name="my_tabs_2" className="tab" aria-label="Recommended" defaultChecked />
                            <div className="tab-content border-base-300 bg-base-100 p-10">Tab content 2</div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}
