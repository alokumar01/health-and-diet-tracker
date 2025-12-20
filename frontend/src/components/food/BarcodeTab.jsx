import { IconBarcode, IconCamera, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const BarcodeTab = ({
    barcodeInput,
    onBarcodeInputChange,
    onBarcodeSearch,
    scanningBarcode
}) => {
    return (
        <Card className="border-2 border-dashed border-border">
            <CardContent className="p-8 text-center">
                <div className="mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                        <IconBarcode className="w-20 h-20 text-primary" stroke={1.5} />
                    </div>
                    <CardTitle className="text-xl mb-2">Scan Barcode</CardTitle>
                    <CardDescription className="mb-6">
                        Instantly add food by scanning product barcodes
                    </CardDescription>
                </div>

                {/* Manual Barcode Input */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-left">
                        Or enter barcode manually
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={barcodeInput}
                            onChange={(e) => onBarcodeInputChange(e.target.value)}
                            placeholder="Enter barcode number"
                            className="flex-1 px-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            onClick={() => onBarcodeSearch(barcodeInput)}
                            disabled={!barcodeInput || scanningBarcode}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {scanningBarcode ? (
                                <IconLoader2 className="w-5 h-5 animate-spin" stroke={2} />
                            ) : (
                                <>
                                    <IconSearch className="w-5 h-5" stroke={2} />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <button className="w-full py-4 bg-linear-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <IconCamera className="w-5 h-5" stroke={2} />
                        Open Camera Scanner
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BarcodeTab;
