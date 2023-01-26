package com.alppano.speakon.domain.question.service;

import com.alppano.speakon.common.exception.ResourceForbiddenException;
import com.alppano.speakon.common.exception.ResourceNotFoundException;
import com.alppano.speakon.domain.interview_join.entity.InterviewJoin;
import com.alppano.speakon.domain.interview_join.repository.InterviewJoinRepository;
import com.alppano.speakon.domain.question.dto.QuestionInfo;
import com.alppano.speakon.domain.question.dto.QuestionRequest;
import com.alppano.speakon.domain.question.entity.Question;
import com.alppano.speakon.domain.question.repository.QuestionRepository;
import com.alppano.speakon.domain.user.entity.User;
import com.alppano.speakon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final InterviewJoinRepository interviewJoinRepository;

    @Transactional
    public QuestionInfo createQuestion(QuestionRequest dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("존재하지 않는 회원입니다.")
        );

        InterviewJoin interviewJoin = interviewJoinRepository.findById(dto.getInterviewJoinId())
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 면접 참여자입니다."));

        if (interviewJoinRepository.findByUserIdAndInterviewRoomId(userId, interviewJoin.getInterviewRoom().getId()).isEmpty()) {
            throw new ResourceForbiddenException("면접방에 참여한 사람만 질문을 입력할 수 있습니다.");
        }

        Question question = Question.builder()
                .content(dto.getContent())
                .interviewJoin(interviewJoin)
                .writer(user)
                .build();

        questionRepository.save(question);

        return new QuestionInfo(question, userId);
    }

    @Transactional
    public void deleteQuestion(Long questionId, Long userId) {
        Question question = questionRepository.findById(questionId).orElseThrow(
                () -> new ResourceNotFoundException("존재하지 않는 질문입니다.")
        );

        if (question.getWriter().getId() != userId) {
            throw new ResourceForbiddenException("자신이 작성한 질문만 삭제할 수 있습니다.");
        }

        questionRepository.delete(question);
    }

    @Transactional
    public QuestionInfo updateQuestion(QuestionRequest dto, Long questionId, Long userId) {
        Question question = questionRepository.findById(questionId).orElseThrow(
                () -> new ResourceNotFoundException("존재하지 않는 질문입니다.")
        );

        if (question.getWriter().getId() != userId) {
            throw new ResourceForbiddenException("자신이 작성한 질문만 수정할 수 있습니다.");
        }

        question.setContent(dto.getContent());

        return new QuestionInfo(question, userId);
    }

    public List<QuestionInfo> getQuestionListByInterviewJoin(Long interviewJoinId, Long userId) {
        InterviewJoin interviewJoin = interviewJoinRepository.findById(interviewJoinId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 면접 참여자입니다."));

        if (interviewJoinRepository.findByUserIdAndInterviewRoomId(userId, interviewJoin.getInterviewRoom().getId()).isEmpty()) {
            throw new ResourceForbiddenException("면접방에 참여 중인 사람만 질문 목록을 조회할 수 있습니다.");
        }

        List<Question> list = questionRepository.findAllByInterviewJoinIdOrderByIdAsc(interviewJoinId);

        List<QuestionInfo> questionInfoList = new ArrayList<>();
        for (Question question : list) {
            questionInfoList.add(new QuestionInfo(question, userId));
        }

        return questionInfoList;
    }
}
