"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { Search, FileText, Video, Book, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");

  const faqs = [
    {
      question: "How do I create my first visualization?",
      answer: "To create your first visualization, navigate to the Input page from the dashboard. Select your chart type (line, bar, or pie), enter your data, and click 'Generate Visualization'. Your chart will be displayed on the Output page where you can interact with it and export it in various formats."
    },
    {
      question: "What chart types are supported?",
      answer: "Currently, we support line charts, bar charts, and pie charts. Line and bar charts are great for showing trends over time or comparing values across categories. Pie charts are useful for showing parts of a whole."
    },
    {
      question: "How do I export my visualization?",
      answer: "On the Output page, click the 'Export' button in the top right corner of the chart card. You can export your visualization as PDF, PNG, SVG, JSON, or CSV."
    },
    {
      question: "Can I customize the colors of my charts?",
      answer: "Basic color customization is available in the current version. We're working on adding more advanced customization options in future updates."
    },
    {
      question: "Is there a limit to how much data I can visualize?",
      answer: "The free version allows up to 1,000 data points per visualization. For larger datasets, consider upgrading to our premium plan."
    },
    {
      question: "How do I share my visualizations with others?",
      answer: "You can share your visualizations by exporting them and sending the files, or by using the 'Share' feature (coming soon) which will generate a unique URL for your visualization."
    },
    {
      question: "What data formats can I import?",
      answer: "Currently, you can input data directly through our interface. Support for importing CSV and JSON files is coming soon."
    },
    {
      question: "How do I report a bug or request a feature?",
      answer: "Please use our Contact page to report bugs or request features. We value your feedback and continuously work to improve our platform."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with Data Visualizer",
      description: "Learn the basics of creating your first visualization",
      icon: FileText,
      link: "#"
    },
    {
      title: "Advanced Chart Customization",
      description: "Discover how to customize your charts for better insights",
      icon: Video,
      link: "#"
    },
    {
      title: "Working with Large Datasets",
      description: "Tips and tricks for visualizing large amounts of data",
      icon: Book,
      link: "#"
    },
    {
      title: "Exporting and Sharing Visualizations",
      description: "Learn how to export and share your visualizations",
      icon: FileText,
      link: "#"
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutorials = tutorials.filter(
    (tutorial) => 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Help Center
          </h1>
          
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search for help..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>How can we help you?</CardTitle>
              <CardDescription>
                Browse through our FAQs and tutorials or search for specific topics
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="faq">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    FAQs
                  </TabsTrigger>
                  <TabsTrigger value="tutorials">
                    <Book className="mr-2 h-4 w-4" />
                    Tutorials
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="faq" className="mt-6">
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-muted-foreground">
                        We couldn't find any FAQs matching your search. Try different keywords or browse all FAQs.
                      </p>
                      {searchQuery && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tutorials" className="mt-6">
                  {filteredTutorials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTutorials.map((tutorial, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <tutorial.icon className="h-5 w-5 text-primary" />
                              </div>
                              <CardTitle className="text-base">{tutorial.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">
                              {tutorial.description}
                            </p>
                            <Button variant="outline" size="sm" asChild>
                              <a href={tutorial.link}>View Tutorial</a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tutorials found</h3>
                      <p className="text-muted-foreground">
                        We couldn't find any tutorials matching your search. Try different keywords or browse all tutorials.
                      </p>
                      {searchQuery && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">
              Still Need Help?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our support team is ready to assist you with any questions or issues.
                  </p>
                  <Button asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Browse our comprehensive documentation for detailed information.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="#">View Documentation</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
