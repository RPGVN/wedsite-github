import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Smartphone, Check, Copy, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import vietcombankQR from "@/assets/vietcombank-qr.jpg";
import momoQR from "@/assets/momo-qr.jpg";

type Step = "form" | "method" | "qr" | "done";
type Method = "vietcombank" | "momo";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [method, setMethod] = useState<Method | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const formattedAmount = amount ? Number(amount).toLocaleString("vi-VN") : "0";

  const generateTransactionId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "HP";
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleSubmitForm = () => {
    if (!name.trim()) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập họ tên", variant: "destructive" });
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập số điện thoại hợp lệ", variant: "destructive" });
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({ title: "Số tiền không hợp lệ", description: "Vui lòng nhập số tiền hợp lệ", variant: "destructive" });
      return;
    }
    setTransactionId(generateTransactionId());
    setStep("method");
  };

  const handleSelectMethod = (m: Method) => {
    setMethod(m);
    setStep("qr");
  };

  const handleConfirmDone = () => {
    setStep("done");
    toast({ title: "Đã gửi xác nhận!", description: "Chúng tôi sẽ kiểm tra và xác nhận thanh toán của bạn." });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: "Đã sao chép", description: `${label}: ${text}` });
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, label }: { text: string; label: string }) => (
    <button
      onClick={() => handleCopy(text, label)}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
    >
      {copied === label ? <><Check className="w-3.5 h-3.5" /> Đã chép</> : <><Copy className="w-3.5 h-3.5" /> Sao chép</>}
    </button>
  );

  const InfoRow = ({ label, value, copyText, copyLabel }: { label: string; value: string; copyText?: string; copyLabel?: string }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground text-sm">{value}</span>
        {copyText && copyLabel && <CopyBtn text={copyText} label={copyLabel} />}
      </div>
    </div>
  );

  const handleReset = () => {
    setStep("form");
    setName("");
    setPhone("");
    setAmount("");
    setTransactionId("");
    setMethod(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => step === "form" ? navigate("/") : setStep(step === "qr" ? "method" : step === "method" ? "form" : "form")} className="rounded-xl border-border/50 shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Thanh Toán Học Phí</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {step === "form" && "Nhập thông tin thanh toán"}
            {step === "method" && "Chọn phương thức thanh toán"}
            {step === "qr" && "Quét mã QR để chuyển khoản"}
            {step === "done" && "Thanh toán thành công"}
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-6">
        {["form", "method", "qr", "done"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-2 rounded-full flex-1 transition-colors ${
              ["form", "method", "qr", "done"].indexOf(step) >= i ? "bg-primary" : "bg-muted"
            }`} />
          </div>
        ))}
      </div>

      {/* Step 1: Form */}
      {step === "form" && (
        <Card className="shadow-lg border-border/50 rounded-2xl">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Họ và tên</Label>
              <Input placeholder="Nhập họ tên" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Số điện thoại</Label>
              <Input placeholder="Nhập SĐT" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} className="rounded-xl" maxLength={11} inputMode="numeric" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Số tiền (VNĐ)</Label>
              <Input placeholder="Ví dụ: 500000" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} className="rounded-xl" maxLength={15} inputMode="numeric" />
              {amount && <p className="text-xs text-muted-foreground">{formattedAmount} VNĐ</p>}
            </div>
            <Button onClick={handleSubmitForm} className="w-full rounded-xl h-11 gap-2 font-semibold">
              <Send className="w-4 h-4" /> Thanh toán
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Choose method */}
      {step === "method" && (
        <div className="space-y-4">
          {/* Summary */}
          <Card className="shadow-lg border-border/50 rounded-2xl">
            <CardContent className="pt-5 pb-5 space-y-2">
              <InfoRow label="Họ tên" value={name} />
              <InfoRow label="SĐT" value={phone} />
              <InfoRow label="Số tiền" value={`${formattedAmount} VNĐ`} />
              <InfoRow label="Mã GD" value={transactionId} />
            </CardContent>
          </Card>

          <p className="text-center text-sm font-semibold text-foreground">Chọn phương thức thanh toán</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSelectMethod("vietcombank")}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border/50 bg-card shadow-md hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00703C] to-[#009751] flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-foreground text-sm">Vietcombank</span>
              <span className="text-muted-foreground text-xs">Ngân hàng</span>
            </button>
            <button
              onClick={() => handleSelectMethod("momo")}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border/50 bg-card shadow-md hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A50064] to-[#D1006C] flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-foreground text-sm">Momo</span>
              <span className="text-muted-foreground text-xs">Ví điện tử</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: QR Code */}
      {step === "qr" && method && (
        <div className="space-y-4">
          <Card className="shadow-lg border-border/50 rounded-2xl overflow-hidden">
            <div className={`p-4 text-center ${method === "vietcombank" ? "bg-gradient-to-r from-[#00703C] to-[#009751]" : "bg-gradient-to-r from-[#A50064] to-[#D1006C]"}`}>
              <h3 className="text-white font-bold text-lg">{method === "vietcombank" ? "Vietcombank" : "Ví Momo"}</h3>
              <p className="text-white/80 text-xs mt-0.5">{method === "vietcombank" ? "Ngân hàng TMCP Ngoại Thương Việt Nam" : "Chuyển tiền nhanh qua ví điện tử"}</p>
            </div>
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <div className="bg-white p-3 rounded-2xl shadow-md mb-5">
                <img
                  src={method === "vietcombank" ? vietcombankQR : momoQR}
                  alt={method === "vietcombank" ? "Vietcombank QR" : "Momo QR"}
                  className="w-64 h-64 object-contain rounded-xl"
                />
              </div>
              <div className="w-full space-y-2">
                <InfoRow label="Chủ TK" value="TRUONG BA DAT" />
                <InfoRow
                  label={method === "vietcombank" ? "Số TK" : "SĐT"}
                  value={method === "vietcombank" ? "9852972648" : "0852972648"}
                  copyText={method === "vietcombank" ? "9852972648" : "0852972648"}
                  copyLabel={method === "vietcombank" ? "STK" : "SĐT"}
                />
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Số tiền cần chuyển</p>
                  <p className="font-extrabold text-primary text-xl">{formattedAmount} VNĐ</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Nội dung chuyển khoản</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-bold text-foreground text-sm">{transactionId}</p>
                    <CopyBtn text={transactionId} label="Nội dung" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleConfirmDone} className="w-full rounded-xl h-12 gap-2 font-semibold text-base">
            <Check className="w-5 h-5" /> Tôi đã chuyển khoản xong
          </Button>
          <p className="text-center text-xs text-muted-foreground">Khi quét mã QR, số tiền và nội dung đã được điền sẵn — không cần nhập lại</p>
        </div>
      )}

      {/* Step 4: Done */}
      {step === "done" && (
        <Card className="shadow-lg border-border/50 rounded-2xl">
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-extrabold text-foreground">Thanh toán thành công!</h2>
            <p className="text-muted-foreground text-sm">Giao dịch của bạn đã được xác nhận tự động. Cảm ơn bạn đã thanh toán!</p>
            <div className="w-full space-y-2 mt-2">
              <InfoRow label="Họ tên" value={name} />
              <InfoRow label="Số tiền" value={`${formattedAmount} VNĐ`} />
              <InfoRow label="Phương thức" value={method === "vietcombank" ? "Vietcombank" : "Momo"} />
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full rounded-xl h-11 mt-2 font-semibold">
              Thanh toán khác
            </Button>
            <Button onClick={() => navigate("/")} variant="ghost" className="w-full rounded-xl font-semibold">
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Payment;
