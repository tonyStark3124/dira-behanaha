"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scoreTintStyle } from "@/lib/scores";
import { formatILS, formatInt, formatPercent, formatScore } from "@/lib/utils";
import type { CityAggregate } from "@/lib/types";

interface CityDetailDialogProps {
  city: CityAggregate | null;
  onClose: () => void;
}

export function CityDetailDialog({ city, onClose }: CityDetailDialogProps) {
  return (
    <Dialog open={!!city} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {city?.city} — {city?.lotteryCount} הגרלות
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מס׳ הגרלה</TableHead>
                <TableHead>קבלן</TableHead>
                <TableHead className="text-center">דירות</TableHead>
                <TableHead className="text-center">נרשמים</TableHead>
                <TableHead className="text-end">מחיר/מ״ר</TableHead>
                <TableHead className="text-end">שוק/מ״ר</TableHead>
                <TableHead className="text-center">רווח %</TableHead>
                <TableHead className="text-center">הצלחה %</TableHead>
                <TableHead className="text-center">ציון רווח</TableHead>
                <TableHead className="text-center">ציון סיכוי</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {city?.lotteries.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell className="font-mono text-xs">{lot.id}</TableCell>
                  <TableCell className="max-w-[10rem] truncate text-xs">
                    {lot.contractor || "—"}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {formatInt(lot.apartments)}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {formatInt(lot.applicants)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    {formatILS(lot.pricePerMeter)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    {formatILS(lot.marketPricePerMeter)}
                  </TableCell>
                  <TableCell
                    className="text-center tabular-nums text-xs font-semibold"
                    style={scoreTintStyle(lot.profitScore)}
                  >
                    {formatPercent(lot.profitPct)}
                  </TableCell>
                  <TableCell
                    className="text-center tabular-nums text-xs"
                    style={scoreTintStyle(lot.chanceScore)}
                  >
                    {formatPercent(lot.successPct)}
                  </TableCell>
                  <TableCell
                    className="text-center tabular-nums text-xs font-semibold"
                    style={scoreTintStyle(lot.profitScore)}
                  >
                    {formatScore(lot.profitScore)}
                  </TableCell>
                  <TableCell
                    className="text-center tabular-nums text-xs font-semibold"
                    style={scoreTintStyle(lot.chanceScore)}
                  >
                    {formatScore(lot.chanceScore)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
