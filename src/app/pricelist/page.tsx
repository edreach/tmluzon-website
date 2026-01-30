
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { getPricelists } from "@/lib/data-server";


export default async function PricelistPage() {
  const pricelistGroups = await getPricelists();

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
                    {group.files.map((file) => (
                      <div
                        key={file.id}
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
                        <Button
                          asChild
                          className="w-full sm:w-auto flex-shrink-0"
                        >
                          <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
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

            {pricelistGroups.length === 0 && (
                <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        No pricelists have been uploaded yet.
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

