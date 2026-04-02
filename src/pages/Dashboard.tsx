import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, DollarSign, CalendarDays, Search, Plus, Download, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [search, setSearch] = useState("");

  // Demo data
  const stats = {
    totalStudents: 0,
    revenue: 0,
    todayRecords: 0,
  };

  const records: {
    id: string;
    name: string;
    licenseClass: string;
    documents: string;
    paid: number;
    date: string;
  }[] = [];

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.includes(search)
  );

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">
            Bảng Điều Khiển
          </h1>
          <p className="text-muted-foreground mt-1">Chào mừng trở lại, Admin!</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={async () => { await signOut(); navigate("/login"); }}
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Tìm tên/CCCD..."
          className="pl-10 h-12 bg-card"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-semibold tracking-wide">
              TỔNG HỌC VIÊN
            </p>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalStudents}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 shadow-sm">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-semibold tracking-wide">
              DOANH THU THU VỀ
            </p>
            <p className="text-2xl font-bold text-primary">
              {stats.revenue.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today card */}
      <Card className="mb-6 bg-primary border-none shadow-md">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <CalendarDays className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-primary-foreground/80 font-semibold tracking-wide">
              HÔM NAY
            </p>
            <p className="text-2xl font-bold text-primary-foreground">
              {stats.todayRecords} hồ sơ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="shadow-sm">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground text-sm tracking-wide">
              DANH SÁCH HỒ SƠ MỚI NHẤT
            </h3>
            <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
              <Download className="w-4 h-4" />
              Tải báo cáo CSV
            </button>
          </div>

          <div className="overflow-x-auto -mx-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">HỌC VIÊN / MÃ ID</TableHead>
                  <TableHead className="text-xs font-semibold">HẠNG BẰNG</TableHead>
                  <TableHead className="text-xs font-semibold">THÀNH PHẦN HS</TableHead>
                  <TableHead className="text-xs font-semibold">TIỀN NỘP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-10"
                    >
                      Chưa có hồ sơ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.id}</div>
                      </TableCell>
                      <TableCell>{r.licenseClass}</TableCell>
                      <TableCell>{r.documents}</TableCell>
                      <TableCell>{r.paid.toLocaleString("vi-VN")} đ</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* FAB */}
      <Button
        onClick={() => navigate("/register")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg p-0"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
