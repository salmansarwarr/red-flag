import { ReactNode } from "react";
import { Dialog } from "@headlessui/react";

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                    {children}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
