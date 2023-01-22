package com.alppano.speakon.feedback.entity;

import com.alppano.speakon.interview.entity.Interview;
import com.alppano.speakon.question.entity.Question;
import com.alppano.speakon.user.entity.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question", nullable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "writer_id")
    private User writer;

    @Column(columnDefinition = "TINYINT(1)", nullable = false)
    private int score;

    @Column(length = 500)
    private String content;

    public void setQuestion(Question question) {
        if (this.question != null) {
            this.question.getFeedbacks().remove(this);
        }

        this.question = question;
        this.question.getFeedbacks().add(this);
    }
}
