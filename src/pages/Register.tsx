import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Image, CreditCard, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    cccd: "",
    phone: "",
    licenseClass: "",
    address: "",
    gender: "",
    tuitionPaid: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.cccd || !formData.phone) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ họ tên, CCCD và số điện thoại.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Đăng ký thành công!",
      description: `Học viên ${formData.fullName} đã được đăng ký.`,
    });
    setFormData({
      fullName: "",
      dob: "",
      cccd: "",
      phone: "",
      licenseClass: "",
      address: "",
      gender: "",
      tuitionPaid: "",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-foreground">Đăng Ký Học Viên</h1>
        <p className="text-muted-foreground text-sm mt-1">Điền thông tin để đăng ký khóa học</p>
      </div>

      {/* Section 1: Student Info */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold text-primary mb-5">
            1. THÔNG TIN HỌC VIÊN
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                HỌ VÀ TÊN (IN HOA)
              </Label>
              <Input
                placeholder="NGUYỄN VĂN A"
                className="mt-1 uppercase"
                value={formData.fullName}
                onChange={(e) =>
                  handleChange("fullName", e.target.value.toUpperCase())
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                  NGÀY SINH
                </Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                  SỐ CCCD
                </Label>
                <Input
                  placeholder="037xxxxxx888"
                  className="mt-1"
                  value={formData.cccd}
                  onChange={(e) => handleChange("cccd", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                  SỐ ĐIỆN THOẠI
                </Label>
                <Input
                  placeholder="09xxxxxx888"
                  className="mt-1"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                  HẠNG BẰNG
                </Label>
                <Select
                  value={formData.licenseClass}
                  onValueChange={(v) => handleChange("licenseClass", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn hạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">Hạng A1</SelectItem>
                    <SelectItem value="A2">Hạng A2</SelectItem>
                    <SelectItem value="A1-X">Hạng A1 – X</SelectItem>
                    <SelectItem value="B1">Hạng B1</SelectItem>
                    <SelectItem value="B2">Hạng B2</SelectItem>
                    <SelectItem value="C">Hạng C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                  ĐỊA CHỈ THƯỜNG TRÚ
                </Label>
                <Input
                  placeholder="Số nhà, Tên đường"
                  className="mt-1"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground tracking-wide">
                  GIỚI TÍNH
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => handleChange("gender", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Documents */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold text-primary mb-5">
            2. HỒ SƠ NỘP KÈM
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: FileText, label: "GIẤY KSK" },
              { icon: Image, label: "6 ẢNH 3X4" },
              { icon: CreditCard, label: "CCCD PHOTO" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
                <Icon className="w-7 h-7 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Payment */}
      <Card className="mb-6 bg-dark-card border-none shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold text-dark-card-foreground mb-4">
            3. THU TIỀN
          </h2>
          <div>
            <Label className="text-xs font-semibold text-dark-card-foreground/70 tracking-wide">
              SỐ TIỀN ĐÃ ĐÓNG HỌC PHÍ (VNĐ)
            </Label>
            <Input
              placeholder="0"
              className="mt-1 bg-dark-card border-dark-card-foreground/20 text-dark-card-foreground placeholder:text-dark-card-foreground/40"
              value={formData.tuitionPaid}
              onChange={(e) => handleChange("tuitionPaid", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold">
        Đăng ký học viên
      </Button>

      <Button
        variant="outline"
        className="w-full h-12 text-base font-semibold mt-3"
        onClick={() => navigate("/thanh-toan")}
      >
        💳 Thanh toán học phí
      </Button>
    </div>
  );
};

export default Register;
