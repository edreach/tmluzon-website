import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

export default function PricelistPage() {
  const pricelistGroups = [
    {
      brand: "CARRIER",
      files: [
        {
          title: "CARRIER",
          fileName: "carrier [CCAC] 2025 Price List for AC (As of January 2025).pdf",
          url: "#",
        },
      ],
    },
    {
      brand: "Daikin",
      files: [
        {
          title: "daikin Approved_FY25 DPH Price List 1748828102",
          fileName: "daikin Approved_FY25 DPH Price List 1748828102.pdf",
          url: "#",
        },
      ],
    },
    {
      brand: "GREE",
      files: [
        {
          title: "R&CAC Pricelist Effective July 01, 2022",
          fileName: "GREE R&CAC Pricelist Effective July 01, 2022.pdf",
          url: "#",
        },
        {
          title: "GREE CAC Pricelist Effective October 1, 2022",
          fileName: "GREE [CAC] Pricelist Effective October 1 2022.pdf",
          url: "#",
        },
      ],
    },
    {
      brand: "HISENSE",
      files: [
        {
          title: "HISENSE",
          fileName: "Hisense Effective 1st Oct - Hisense Split Price List.pdf",
          url: "#",
        },
      ],
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Official Pricelists
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Download our latest product and service pricelists.
          </p>
        </div>

        <div className="space-y-8">
          {pricelistGroups.map((group) => (
            <Card key={group.brand}>
              <CardHeader>
                <CardTitle className="text-2xl">{group.brand}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <FileText className="h-6 w-6 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-semibold">{file.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.fileName}
                          </p>
                        </div>
                      </div>
                      <Button asChild className="w-full sm:w-auto flex-shrink-0">
                        <a href={file.url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
