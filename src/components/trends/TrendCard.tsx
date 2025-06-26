"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, ExternalLink, TrendingUp, Clock, Eye, Video } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface TrendCardProps {
  term: string
  value: number
  rank?: number
  description?: string
  hint?: string[]
  percentage_increase?: string
  time_started?: string
  timestamp: string
}

export function TrendCard({
  term,
  value,
  rank,
  description,
  hint = [],
  percentage_increase,
  time_started,
  timestamp
}: TrendCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  }

  const getRankColor = (rank?: number) => {
    return "bg-muted text-muted-foreground";
  }

  const getVolumeColor = (value: number) => {
    return "text-foreground";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="cursor-pointer overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rank && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(rank)}`}>
                        {rank}
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-left line-clamp-2">
                        {term}
                      </CardTitle>
                       <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="cursor-help">
                                <Eye className="w-4 h-4 mr-1.5" />
                                {formatNumber(value)}+ pesquisas
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Volume de pesquisas nas últimas 24 horas</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                         
                         {percentage_increase && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="cursor-help">
                                  <TrendingUp className="w-4 h-4 mr-1.5" />
                                  {percentage_increase}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Aumento percentual em relação ao período anterior</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                         )}
                         
                         {time_started && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="cursor-help">
                                  <Clock className="w-4 h-4 mr-1.5" />
                                  {time_started}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Tempo desde o início da tendência</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                         )}
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-5 h-5 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
          </CollapsibleTrigger>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                style={{ overflow: "hidden" }}
              >
                <CardContent className="pt-0 space-y-4">
                  {description && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Descrição
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {description}
                      </p>
                    </motion.div>
                  )}

                  {hint && hint.length > 0 && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Principais Informações
                      </h4>
                      <div className="space-y-2">
                        {hint.map((item, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                              {item}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                                     <motion.div 
                     className="flex flex-wrap gap-2"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4, duration: 0.3 }}
                   >
                     <Badge variant="outline" className="text-xs">
                       Volume: {formatNumber(value)}+ pesquisas
                     </Badge>
                     {percentage_increase && (
                       <Badge variant="outline" className="text-xs">
                         ↗ {percentage_increase}
                       </Badge>
                     )}
                     {time_started && (
                       <Badge variant="outline" className="text-xs">
                         {time_started}
                       </Badge>
                     )}
                     {rank && (
                       <Badge variant="default" className="text-xs">
                         #{rank} trending
                       </Badge>
                     )}
                   </motion.div>

                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 0.3 }}
                     className="pt-4 border-t"
                   >
                     <Link href={`/dashboard/studio?trend=${encodeURIComponent(term)}&rank=${rank}&volume=${value}&description=${encodeURIComponent(description || '')}&hints=${encodeURIComponent(JSON.stringify(hint || []))}`}>
                       <Button className="w-full gap-2">
                         <Video className="w-4 h-4" />
                         Usar essa trend para criar roteiro
                       </Button>
                     </Link>
                   </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Collapsible>
      </Card>
    </motion.div>
  )
} 