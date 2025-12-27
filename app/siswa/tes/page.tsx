"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import StudentSidebar from "@/components/student-sidebar"

interface Question {
  id: number
  pertanyaan: string
  options: {
    id: number
    teks: string
    nilai: number
  }[]
}

interface TestData {
  questions: Question[]
  userName: string
}

export default function TestPage() {
  const [testData, setTestData] = useState<TestData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/siswa/questions")
      if (res.ok) {
        const data = await res.json()
        setTestData(data)
      } else {
        setError("Gagal memuat soal tes")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat memuat soal")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleNext = () => {
    if (currentQuestion < (testData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!testData) return

    const answeredQuestions = Object.keys(answers).length
    const totalQuestions = testData.questions.length

    if (answeredQuestions < totalQuestions) {
      setError(`Anda belum menjawab ${totalQuestions - answeredQuestions} pertanyaan`)
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/siswa/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/siswa/hasil/${data.testId}`)
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Gagal mengirim jawaban")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat mengirim jawaban")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <StudentSidebar userName={testData?.userName || ""} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Memuat soal tes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!testData) {
    return (
      <div className="flex h-screen">
        <StudentSidebar userName="" />
        <div className="flex-1 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Gagal memuat data tes"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / testData.questions.length) * 100
  const currentQ = testData.questions[currentQuestion]
  const answeredQuestions = Object.keys(answers).length
  const isAnswered = answers[currentQ.id] !== undefined

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar userName={testData.userName} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tes Minat Bakat</h1>
            <p className="text-gray-600 mb-4">
              Jawab semua pertanyaan dengan jujur sesuai dengan minat dan bakat Anda
            </p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pertanyaan {currentQuestion + 1} dari {testData.questions.length}</span>
                <span>{answeredQuestions} / {testData.questions.length} dijawab</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Pertanyaan {currentQuestion + 1}
                </CardTitle>
                <CardDescription className="text-base">
                  {currentQ.pertanyaan}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQ.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
                  className="space-y-4"
                >
                  {currentQ.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                      <Label
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer text-sm leading-relaxed"
                      >
                        {option.teks}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Sebelumnya
              </Button>

              <div className="flex space-x-3">
                {currentQuestion < testData.questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isAnswered}
                  >
                    Selanjutnya
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isAnswered || submitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selesai & Kirim
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Question Navigation */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Navigasi Pertanyaan</h3>
              <div className="grid grid-cols-10 gap-2">
                {testData.questions.map((_, index) => {
                  const isCurrent = index === currentQuestion
                  const isAnswered = answers[testData.questions[index].id] !== undefined
                  const isCompleted = isAnswered

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-colors ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : isCompleted
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>Saat ini</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Dijawab</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                  <span>Belum dijawab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
